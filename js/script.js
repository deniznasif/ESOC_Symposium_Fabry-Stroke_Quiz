$(document).ready(function() {

	function init() {

		var quiz = dict.quiz,
			questions = quiz.questions,
			questionCount = questions.length,
			questionArrayCount = 0,
			currentQuestionCount = 1,
			startScreen = quiz.startScreen,
			questionNumber,
			question,
			references,
			popup,
			popupAnswer,
			popupText;

		function setStartScreen() {
			$('.startScreenWrapper h1').html(startScreen.header);
			$('.startScreenWrapper h2').html(startScreen.subHeader);
			$('.startScreenWrapper .startButton').html(startScreen.buttonText);
			$('.dateOfPrep span.jobCode').html(startScreen.jobCode);
			$('.dateOfPrep span.dop').html(startScreen.dateOfPrep);
		}

		function shuffleQuestions(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		};

		function setQuestion() {
			$('.question h1').html('<span>Q' + currentQuestionCount + ": </span>" + questions[questionArrayCount].question);
			$('.questionCount span.current').html(currentQuestionCount);
			$('.questionCount span.count').html(questionCount);
			setAnswers();
		};

		function setAnswers() {
			var listItems = $('ol.answers li'),
				listArray = [],
				answers = questions[questionArrayCount].answers,
				answersArray = [];

			// set corresponding index of answer into corresponding index of list item
			for(var i=0, x=0; i < answers.length, x < listItems.length; i++, x++) {
				var arrValue = answers[i].answer,
					status = answers[i].status
					listValue = listItems[x];
				listValue.append(arrValue);
				$(listValue).attr("status", status);
			};
			//console.log(answersArray);
			//console.log(listArray);

			// set references
			var referencesList = questions[questionArrayCount].References;
			$.each(referencesList, function(i, item) {
				var ref = '<li>'+ item +'</li>';
				$('ol.refsWrapper').append(ref);
			});


			var timeout = setTimeout(function() {
				clearTimeout(timeout);
				$('.question h1, ol.answers li, .refsWrapper').fadeIn(500);
			},100);
			
		};

		function clearQuestion() {
			$('.question h1').empty();
			$('ol.answers li').empty();
			$('ol.refsWrapper').empty();
			$('.popupWrapper .popup ol').empty();
			setQuestion();
		};

		function setDraggable() {
			$('ol.answers li').draggable({
				containment: '.answersBox',
				stack: 'ol.answers li',
				cursor: 'move',
				revert: true
			});

			$('#answersBox').droppable({
				accept: 'ol#answersList li',
				hoverClass: 'hovered',
				drop: handleAnswerDrop
			});
		};

		function handleAnswerDrop(event, ui) {
			var answerStatus = ui.draggable.attr('status');
			var answerIndex = ui.draggable.index() + 1;
			//console.log(answerIndex);
			//console.log(answerStatus);

			// lock answer
			ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
			ui.draggable.draggable( 'option', 'revert', false );

			if (answerStatus == 'correct') {
				$('p.incorrect').hide();
				$('.popupWrapper .popup h1').html('Correct');
			} else {
				$('p.incorrect').show();
				$('.popupWrapper .popup h1').html('Incorrect');
			}

			$('.popupWrapper .popup ol').attr('start', answerIndex)
			$('.popupWrapper .popup ol li').append(ui.draggable.html());
			$('.popupWrapper .popup p.body').html(questions[questionArrayCount].popup.text);

			$('.popupWrapper').fadeIn(500);
		};

		// Button click functions
		$('.startScreenWrapper .startButton').on('click', function() {
			$('.startScreenWrapper').fadeOut(500, function() {
				$('.quizWrapper').fadeIn(500);
			});
		});

		$('.popupWrapper .closeButton').on('click', function() {
			$('ol.answers li').draggable('disable');
			$('.popupWrapper').fadeOut(500, function() {
				$('.nextButton').fadeIn(500);
			});
		});

		$('.nextButton').on('click', function(event) {
			event.stopPropagation();
			//console.log('clicked');
			$(this).fadeOut(500);
			$('.question h1, .refsWrapper').fadeOut(500);
			$('ol.answers li').fadeOut(500, function() {
				$(this).draggable( 'option', 'revert', true );
				$(this).css({
					'left': '0px',
					'top' : '0px'
				});
				clearQuestion();
			});
			if (currentQuestionCount < questionCount) {
				currentQuestionCount++;
				questionArrayCount++;
				console.log('Current question count: ' + currentQuestionCount);
				console.log('Question Array count: ' + questionArrayCount);
				$('ol.answers li').draggable('enable');
			}
		});

		// first fire functions
		questions = shuffleQuestions(questions);
		setStartScreen();
		setQuestion();
		setDraggable();

		//console.log("There are " + questionCount + " questions.");
		//console.log(questions);

	};

	init();

});  // document ready
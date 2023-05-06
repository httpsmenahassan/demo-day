const trash = document.getElementsByClassName("fa-trash");
const upArrow = document.getElementsByClassName("fa-arrow-up-long");
const downArrow = document.getElementsByClassName("fa-arrow-down");


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const foodId = element.closest('li').dataset.nameid
        fetch('/food', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'foodId': foodId,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


Array.from(upArrow).forEach(function(element) {
    element.addEventListener('click', function(){
      const foodId = element.closest('li').dataset.nameid
      fetch('/food', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'foodId': foodId,
          'upArrow': true,
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});


Array.from(downArrow).forEach(function(element) {
    element.addEventListener('click', function(){
      const foodId = element.closest('li').dataset.nameid
      fetch('/food', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'foodId': foodId,
          'upArrow': false
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});
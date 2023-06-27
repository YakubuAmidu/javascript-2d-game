window.addEventListener('load', function(){
    console.log('Hello...');
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 720;

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if(e.key == 'ArrowDown'){
                    this.keys.push(e.key);
                }
                console.log('E.KEY: ', e.key, 'THIS.KEYS: ', this.keys);
            })
        }
    };

    class Player {

    }

    class Background {

    }

    class Enemy {

    }

    function handleEnemies() {

    }

    function displayStatusText() {

    }

    const input = new InputHandler();

    function animate() {

    }
})

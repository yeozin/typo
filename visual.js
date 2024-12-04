import {Text} from './text.js';
import {Particle} from './particle.js';

export class Visual{
    constructor(){
        this.text = new Text();

        this.texture = PIXI.Texture.from('particle.png');
        this.particles = [];
        
        this.mouse = {
            x: 0,
            y: 0,
            radius: 30, //마우스 원 크기 조절
        };

        this.texts = ['어쩌다가 동성애자가 되셨어요?',
                      '여자의 몸은 성역이야', 
                      '장애인은 나중에', 
                      '그냥 웃자고 한 얘기야', 
                      '아픈 사림이 왜 사회에 나와?', 
                      '그냥 가만히 있어']; // 출력할 텍스트 배열
        this.currentIndex = 0; // 현재 텍스트의 인덱스

        // 클릭 시 텍스트 변경 이벤트 리스너
        document.addEventListener('click', this.changeText.bind(this), false);
        document.addEventListener('pointermove', this.onMove.bind(this), false);
    }

    show(stageWdith, stageHeight, stage){
        if(this.container){
            stage.removeChild(this.container);
        }

        // 두 번째 인자(density) 클수록 글자를 이루는 원 사이 간격이 멀어짐
        this.pos = this.text.setText(
            this.texts[this.currentIndex], 1, stageWdith, stageHeight);
        
        this.container = new PIXI.ParticleContainer(
            this.pos.length,
            {
                verticles: false, 
                position: true,
                rotation: false, 
                scale: false, 
                uvs: false, 
                tint: false,
            }
        );
        stage.addChild(this.container);

        this.particles = [];
        for(let i = 0; i < this.pos.length; i++){
            const item = new Particle(this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    changeText() {
        // 클릭 시 텍스트 인덱스를 증가시키고, 인덱스가 텍스트 배열 길이를 초과하지 않도록 설정
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        this.show(window.innerWidth, window.innerHeight, this.container.parent); // 새로운 텍스트로 갱신
    }

    animate(){
        for (let i = 0; i < this.particles.length; i++){
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;
            
            if (dist<minDist){
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sign(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax;
                item.vy -= ay;
            }

            item.draw();
        }
    }

    onMove(e){
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    
}
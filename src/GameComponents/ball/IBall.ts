interface IBall {
	initBall(): void;
	update(time: number, delta: number): void;
    setVelocity(x: number, y: number): void;
    setVelocityX(x: number): void;
}
export default IBall;
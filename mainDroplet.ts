// @ts-ignore
import anime from "animejs";

const styleProxy = {
    get: (object: any, property: any) => {
        return (value: any) => {
            if (value) {
                object[property] = value;
                return new Proxy(object, styleProxy);
            }
            return object[property];
        };
    },
};

const style = (element: any) => {
    return new Proxy(element.style, styleProxy);
};

const container: any = document.querySelector(".circles-container");
const circles: any = document.querySelectorAll(".circle");

const cw: any = container.offsetWidth;
const ch: any = container.offsetHeight;

const baseRadius = 600;

const getCenter = (radius: number) => {
    return [cw / 2 - radius / 2, ch / 2 - radius / 2];
};

[...circles].reverse().forEach((circle: any, index: number, arr: any) => {
    const radius = Math.round(baseRadius * ((index + 0.5) / arr.length)); //Math.round((index + circles.length) * ((index+0.5) * (circles.length/50)));
    const [x, y] = getCenter(radius);
    style(circle).left(`${x}px`).top(`${y}px`).width(`${radius}px`).height(`${radius}px`);
});





const droplet = () => {
    circles.forEach((circle: any, index: number) => {
        const top = parseInt(circle.style.top.replace("px", "")) - index * 11;
        style(circle).top(`${top}px`);
    });

    const circlesArr = [...circles].reverse();
    const circlesToAnimate = [...circlesArr].splice(0, 16)
    
    anime({
        targets: circlesToAnimate,
        delay: anime.stagger(50, { easing: "linear" }),
        top: [
            {
                value: (el: any, index: number) => {
                    return `+=${(circlesToAnimate.length - index - 1) * 22}`;
                },
                duration: 2000,
            },
            {
                value: (el: any, index: number) => {
                    return `-=${(circlesToAnimate.length - index - 1) * 22}`;
                },
                duration: 2000,
            },
        ],
        easing: "easeInOutQuad",
        loop: true,
        direction: "alternate",
    });
}

//droplet();


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
const waveDeepness = 0.28;
const waveThreshold = 300;
const skewDeg = -20;
const rotationDeg = 45;
const speed = 0.5;
const zIndexOffset = 10;

const getCenter = (radius: number) => {
    return [cw / 2 - radius / 2, ch / 2 - radius / 2];
};

[...circles].reverse().forEach((circle: any, index: number, arr: any) => {
    circle.style.transform = `rotate(${rotationDeg}deg) skew(${skewDeg}deg, ${skewDeg}deg)`;
    const radius = Math.round(baseRadius * ((index + 0.5) / arr.length)); //Math.round((index + circles.length) * ((index+0.5) * (circles.length/50)));
    const [x, y] = getCenter(radius);
    style(circle).left(`${x}px`).top(`${y}px`).width(`${radius}px`).height(`${radius}px`); //.zIndex(`${index}`); // looks good
});

const justAZoom = () => {
    const steps = Array.from({ length: circles.length }, (_, i) => i * 30);
    const getTopOffset = (radius: number): number => {
        if (radius > waveThreshold) {
            return radius * waveDeepness;
        }
        return -radius * waveDeepness + waveDeepness * baseRadius;
    };

    const getZindex = (radius: number): number => {
        const closest = steps.reduce((prev: any, curr: any) =>
            Math.abs(curr - radius) < Math.abs(prev - radius) ? curr : prev
        );
        return (circles.length - steps.indexOf(closest) - 1) + zIndexOffset;
    };

    const zoomCircle = (circle: HTMLElement) => {
        let radius = parseFloat(circle.style.width.replace("px", ""));
        if (radius > baseRadius) {
            radius = 1;
        }

        const [x, y] = getCenter(radius + speed);
        const topOffset = getTopOffset(radius + speed);

        style(circle)
            .width(`${radius + speed}px`)
            .height(`${radius + speed}px`)
            .left(`${x}px`)
            .top(`${y + topOffset}px`)
            .opacity(`${(baseRadius - radius) / baseRadius}`)
            .zIndex(`${getZindex(radius)}`);
        requestAnimationFrame(() => zoomCircle(circle));
    };

    circles.forEach((circle: HTMLElement, index: number) => {
        zoomCircle(circle);
    });
};

const dropletStuff = () => {
    circles.forEach((circle: any, index: number) => {
        const top = parseInt(circle.style.top.replace("px", "")) - index * 11;
        style(circle).top(`${top}px`);
        if (index < 5) {
            circle.style.backgroundColor = "grey";
        }
    });

    const circlesArr = [...circles].reverse();
    const circlesToAnimate = [...circlesArr].splice(0, 15)
    
    anime({
        targets: circlesToAnimate,
        delay: anime.stagger(50, { easing: "linear" }),
        top: [
            {
                value: (el: any, index: number) => {
                    return `+=${(circlesToAnimate.length - index - 1) * 15}`;
                },
                duration: 2000,
            },
            {
                value: (el: any, index: number) => {
                    return `-=${(circlesToAnimate.length - index - 1) * 15}`;
                },
                duration: 2000,
            },
        ],
        easing: "easeInOutQuad",
        loop: true,
        direction: "alternate",
    });
}



// ???? what do ????
justAZoom();
//dropletStuff();

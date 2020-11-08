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

circles.forEach((circle: any, index: number, arr: any) => {
    // const top = parseInt(circle.style.top.replace("px", "")) - index * 11;
    // style(circle).top(`${top}px`);
    // if (index < 10) {
    //     const top = parseInt(circle.style.top.replace("px", "")) - index * 11;
    //     style(circle).top(`${top}px`);
    // } else {
    //     const top = parseInt(circle.style.top.replace("px", "")) - (arr.length - index) * 11;
    //     style(circle).top(`${top}px`);
    // }
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

    circles.forEach((circle: HTMLElement) => {
        zoomCircle(circle);
    });
};

justAZoom();

// const oneByOne = (index: number, sign: string) => {
//     anime({
//         targets: [...circles].splice(circles.length - index - 1, circles.length),
//         top: `${sign}=${28}`,
//         duration: 200,
//         easing: "linear",
//         complete() {
//             if (index === circles.length - 5) {
//                 oneByOne(0, sign === "-" ? "+" : "-");
//                 return;
//             }
//             oneByOne(index + 1, sign);
//         },
//     });
// };

// oneByOne(0, "+");

const droplet = () => {
    const circlesArr = [...circles].reverse();
    const circlesToAnimate = [...circlesArr].splice(0, 16);

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
        update(anim: any) {
            // for (let u = 0; u < circlesArr.length; u++) {
            //     const circle = circlesArr[u];
            //     const width = parseInt(circle.style.width.replace("px", ""));
            //     const height = parseInt(circle.style.height.replace("px", ""));
            //     const left = parseInt(circle.style.left.replace("px", ""));
            //     const top = parseInt(circle.style.top.replace("px", ""));
            //     console.log(u )
            //     if (width > 700) {
            //         // const radius = 0 //Math.round((index + circles.length) * ((index+0.5) * (circles.length/50)));
            //         // const [x, y] = getCenter(radius);
            //         // circle.style.width = `${radius}px`;
            //         // circle.style.height = `${radius}px`;
            //         // circle.style.top = `${y}px`;
            //         // circle.style.left = `${x}px`;
            //     } else {
            //         const [x, y] = getCenter(width);
            //         //style(circle).width(`${width + 1}px`).height(`${height + 1}px`).left(`${x}px`).top(`${y}px`);
            //     }
            // }
        },
        easing: "easeInOutQuad",
        loop: true,
        direction: "alternate",
    });
};

//droplet();

import { buyAndHold } from "./buyAndHold";
import { shortAndHold } from "./shortAndHold";
import { random } from "./random";
import { moreRandom } from "./moreRandom";
import { buyLowSellHigh } from "./buyLowSellHigh";
import { scaledBuyLowSellHigh } from "./scaledBuyLowSellHigh";

type Example = {
    name: string;
    script: string;
};

export const examples: Example[] = [
    {
        name: 'Buy and Hold',
        script: buyAndHold,
    },
    {
        name: 'Short and Hold',
        script: shortAndHold,
    },
    {
        name: 'Random',
        script: random,
    },
    {
        name: '(More) Random',
        script: moreRandom,
    },
    {
        name: 'Buy Low, Sell High',
        script: buyLowSellHigh,
    },
    {
        name: '(Scaled) Buy Low, Sell High',
        script: scaledBuyLowSellHigh,
    }
];

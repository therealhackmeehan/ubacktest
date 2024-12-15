import { buyAndHold } from './buyAndHold';
import { random } from './random';
import { shortAndHold } from './shortAndHold';

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
];

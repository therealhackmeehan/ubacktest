import { buyAndHold } from "./typescript/intro/buyAndHold";
import { random } from "./typescript/intro/random";
import { moreRandom } from "./typescript/intro/moreRandom";
import { rsi } from "./typescript/RSI/rsi";
import { scaledRsi } from "./typescript/RSI/scaledRsi";
import { adaptiveRsi } from "./typescript/RSI/adaptiveRsi";
import { rsiSma } from "./typescript/RSI/rsiSma";
import { rsiVolume } from "./typescript/RSI/rsiVolume";
import { bollinger } from "./typescript/bollinger/bollinger";
import { bollingerSma } from "./typescript/bollinger/bollingerSma";
import { adx } from "./typescript/other/adx";
import { atr } from "./typescript/other/atr";
import { ichimoku } from "./typescript/other/ichimoku";
import { obv } from "./typescript/other/obv";
import { sar } from "./typescript/other/sar";
import { sarReversal } from "./typescript/other/sarReversal";
import { stochastic } from "./typescript/other/stochastic";
import { smaCrossover } from "./typescript/ma/smaCrossover";
import { emaCrossover } from "./typescript/ma/emaCrossover";
import { macd } from "./typescript/ma/macd";
import { tema } from "./typescript/ma/tema";
import { shortAndHold } from "./typescript/intro/shortAndHold";
import { maEnvelope } from "./typescript/ma/maEnvelope";
import { ama } from "./typescript/ma/ama";
import { rsiBreakout } from "./typescript/RSI/rsiBreakout";
import { randomForest } from "./typescript/ml/randomForest";

type Example = {
    name: string;
    script: string;
};

type StrategyExamples = {
    [category: string]: Example[];
};

export const examples: StrategyExamples = {
    "Intro": [
        {
            name: "Buy and Hold Strategy", // GOOD
            script: buyAndHold
        },
        {
            name: "Short and Hold Strategy", // GOOD
            script: shortAndHold
        },
        {
            name: "Random Strategy", // GOOD
            script: random
        },
        {
            name: "(More) Random Strategy", // GOOD
            script: moreRandom
        }
    ],
    "Moving Averages": [
        {
            name: "Simple Moving Average Crossover", // GOOD
            script: smaCrossover
        },
        {
            name: "Exponential Moving Average Crossover", // GOOD
            script: emaCrossover
        },
        {
            name: "Triple Exponential Moving Average", // GOOD
            script: tema
        },
        {
            name: "MACD Strategy", // GOOD
            script: macd
        },
        {
            name: "Moving Average Envelope Strategy", // GOOD
            script: maEnvelope
        },
        {
            name: "Adaptive Moving Average", // GOOD
            script: ama
        }
    ],
    "RSI-Based Strategies": [
        {
            name: "RSI Indicator Strategy",  // GOOD
            script: rsi
        },
        {
            name: "RSI Breakout Strategy", // GOOD
            script: rsiBreakout
        },
        {
            name: 'RSI Indicator Strategy (Scaled)', // GOOD
            script: scaledRsi,
        },
        {
            name: 'RSI Indicator Strategy with Adaptive Bounds', // GOOD
            script: adaptiveRsi,
        },
        {
            name: "RSI with Moving Average Confirmation", // GOOD
            script: rsiSma
        },
        {
            name: "RSI with Volume Confirmation", // GOOD
            script: rsiVolume
        }
    ],
    "Bollinger Band Strategies": [
        {
            name: "Bollinger Bands Strategy", // GOOD
            script: bollinger
        },
        {
            name: "Bollinger Bands with Moving Average Confirmation", // GOOD
            script: bollingerSma
        },
    ],
    "Some Other Strategies": [
        {
            name: "Average True Range (ATR) Strategy",
            script: atr
        },
        {
            name: "ADX Indicator Strategy",
            script: adx
        },
        {
            name: "Ichimoku Cloud Strategy",
            script: ichimoku
        },
        {
            name: "On-Balance Volume Strategy", // GOOD
            script: obv
        },
        {
            name: "Parabolic SAR Strategy",
            script: sar
        },
        {
            name: "Parabolic SAR Trend Reversal", 
            script: sarReversal
        },
        {
            name: "Stochastic Oscillator Strategy", // GOOD
            script: stochastic
        },
    ],
    "Machine Learning": [
        {
            name: "Random Forest Classifier",
            script: randomForest
        },
    ]
};

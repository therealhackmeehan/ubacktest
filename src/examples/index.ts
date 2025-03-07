import { buyAndHold } from "./intro/buyAndHold";
import { random } from "./intro/random";
import { moreRandom } from "./intro/moreRandom";
import { rsi } from "./RSI/rsi";
import { scaledRsi } from "./RSI/scaledRsi";
import { adaptiveRsi } from "./RSI/adaptiveRsi";
import { rsiSma } from "./RSI/rsiSma";
import { rsiVolume } from "./RSI/rsiVolume";
import { bollinger } from "./bollinger/bollinger";
import { bollingerBreakout } from "./bollinger/bollingerBreakout";
import { bollingerSma } from "./bollinger/bollingerSma";
import { adx } from "./other/adx";
import { atr } from "./other/atr";
import { donchian } from "./other/donchian";
import { ichimoku } from "./other/ichimoku";
import { obv } from "./other/obv";
import { sar } from "./other/sar";
import { sarReversal } from "./other/sarReversal";
import { stochastic } from "./other/stochastic";
import { randomForest } from "./ml/randomForest";
import { smaCrossover } from "./ma/smaCrossover";
import { emaCrossover } from "./ma/emaCrossover";
import { macd } from "./ma/macd";
import { tema } from "./ma/tema";
import { shortAndHold } from "./intro/shortAndHold";
import { maEnvelope } from "./ma/maEnvelope";
import { ama } from "./ma/ama";

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
            name: "Buy and Hold Strategy", // GOOD!
            script: buyAndHold
        },
        {
            name: "Short and Hold Strategy", // GOOD!
            script: shortAndHold
        },
        {
            name: "Random Strategy", // GOOD!
            script: random
        },
        {
            name: "(More) Random Strategy", // GOOD!
            script: moreRandom
        }
    ],
    "Moving Averages": [
        {
            name: "Simple Moving Average Crossover", // GOOD!
            script: smaCrossover
        },
        {
            name: "Exponential Moving Average Crossover", //GOOD!
            script: emaCrossover
        },
        {
            name: "Triple Exponential Moving Average", //GOOD!
            script: tema
        },
        {
            name: "MACD Strategy", //GOOD!
            script: macd
        },
        {
            name: "Moving Average Envelope Strategy", //GOOD!
            script: maEnvelope
        },
        {
            name: "Adaptive Moving Average", //GOOD!
            script: ama
        }
    ],
    "RSI-Based Strategies": [
        {
            name: "RSI Indicator Strategy", // WORKING ON THIS ONE.
            script: rsi
        },
        {
            name: 'RSI Indicator Strategy (Scaled)',
            script: scaledRsi,
        },
        {
            name: 'RSI Indicator Strategy with Adaptive Bounds',
            script: adaptiveRsi,
        },
        {
            name: "RSI with Moving Average Confirmation",
            script: rsiSma
        },
        {
            name: "RSI with Volume Confirmation",
            script: rsiVolume
        }
    ],
    "Volatility and Range-Based Strategies": [
        {
            name: "Bollinger Bands Strategy",
            script: bollinger
        },
        {
            name: "Bollinger Bands Breakout",
            script: bollingerBreakout
        },
        {
            name: "Bollinger Bands with Moving Average Confirmation",
            script: bollingerSma
        },
        {
            name: "Donchian Channel Strategy",
            script: donchian
        }
    ],
    "Momentum and Trend Strategies": [
        {
            name: "ADX Indicator Strategy",
            script: adx
        },
        {
            name: "Average True Range Strategy",
            script: atr
        },
        {
            name: "Ichimoku Cloud Strategy",
            script: ichimoku
        },
        {
            name: "On-Balance Volume Strategy",
            script: obv
        },
        {
            name: "Parabolic SAR Strategy",
            script: sar
        },
        {
            name: "Parabolic SAR Trend Reversal",
            script: sarReversal
        }
    ],
    "Oscillator Strategies": [
        {
            name: "Stochastic Oscillator Strategy",
            script: stochastic
        },
    ],
    "Machine Learning Strategy": [
        {
            name: "Random Forest Classification Strategy",
            script: randomForest
        }
    ]
};

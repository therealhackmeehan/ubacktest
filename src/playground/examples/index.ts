import { buyAndHold } from "./intro/buyAndHold";
import { random } from "./intro/random";
import { moreRandom } from "./intro/moreRandom";
import { rsi } from "./RSI/rsi";
import { scaledRsi } from "./RSI/scaledRsi";
import { adaptiveRsi } from "./RSI/adaptiveRsi";
import { rsiSma } from "./RSI/rsiSma";
import { rsiEma } from "./RSI/rsiEma";
import { rsiBollinger } from "./RSI/rsiBollinger";
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

type Example = {
    name: string;
    script: string;
};

type StrategyExamples = {
    [category: string]: Example[];
};

export const examples: StrategyExamples = {
    "Long-Term Strategies": [
        {
            name: "Buy and Hold Strategy",
            script: buyAndHold
        },
        {
            name: "Short and Hold Strategy",
            script: shortAndHold
        }
    ],
    "Market Timing Strategies": [
        {
            name: "Simple Moving Average Crossover",
            script: smaCrossover
        },
        {
            name: "Exponential Moving Average Crossover",
            script: emaCrossover
        },
        {
            name: "Triple Exponential Moving Average",
            script: tema
        },
        {
            name: "MACD Strategy",
            script: macd
        }
    ],
    "RSI-Based Strategies": [
        {
            name: "RSI Indicator Strategy",
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
            name: "RSI with Exponential Moving Average Confirmation",
            script: rsiEma
        },
        {
            name: "RSI with Bollinger Bands Confirmation",
            script: rsiBollinger
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
        {
            name: "Random Strategy",
            script: random
        },
        {
            name: "Advanced Random Strategy",
            script: moreRandom
        }
    ],
    "Machine Learning Strategy": [
        {
            name: "Random Forest Classification Strategy",
            script: randomForest
        }
    ]
};

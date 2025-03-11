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
import { stochastic } from "./typescript/other/stochastic";
import { smaCrossover } from "./typescript/ma/smaCrossover";
import { emaCrossover } from "./typescript/ma/emaCrossover";
import { macd } from "./typescript/ma/macd";
import { tema } from "./typescript/ma/tema";
import { shortAndHold } from "./typescript/intro/shortAndHold";
import { maEnvelope } from "./typescript/ma/maEnvelope";
import { ama } from "./typescript/ma/ama";
import { rsiBreakout } from "./typescript/RSI/rsiBreakout";
import rfClassifier from "./typescript/ml/randomForest";
import { donchianChannel } from "./typescript/other/donchian";
import linReg from "./typescript/regression/linearRegression";
import expReg from "./typescript/regression/exponentialRegression";
import polyReg from "./typescript/regression/polynomialRegression";
import ridgeReg from "./typescript/regression/ridgeRegression";
import lassoReg from "./typescript/regression/lassoRegression";
import logReg from "./typescript/ml/logisticRegression";
import svmClassifier from "./typescript/ml/svm";

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
            name: "Buy and Hold Strategy", //GOOD
            script: buyAndHold
        },
        {
            name: "Short and Hold Strategy", //GOOD
            script: shortAndHold
        },
        {
            name: "Random Strategy", //GOOD
            script: random
        },
        {
            name: "(More) Random Strategy", //GOOD
            script: moreRandom
        }
    ],
    "Moving Averages": [
        {
            name: "Simple Moving Average Crossover", //s
            script: smaCrossover
        },
        {
            name: "Exponential Moving Average Crossover", //
            script: emaCrossover
        },
        {
            name: "Triple Exponential Moving Average", //
            script: tema
        },
        {
            name: "MACD Strategy", //
            script: macd
        },
        {
            name: "Moving Average Envelope Strategy", //
            script: maEnvelope
        },
        {
            name: "Adaptive Moving Average", //
            script: ama
        }
    ],
    "RSI-Based Strategies": [
        {
            name: "RSI Indicator Strategy",  //
            script: rsi
        },
        {
            name: "RSI Breakout Strategy", //
            script: rsiBreakout
        },
        {
            name: 'RSI Indicator Strategy (Scaled)', //
            script: scaledRsi,
        },
        {
            name: 'RSI Indicator Strategy with Adaptive Bounds', //
            script: adaptiveRsi,
        },
        {
            name: "RSI with Moving Average Confirmation", //
            script: rsiSma
        },
        {
            name: "RSI with Volume Confirmation", //
            script: rsiVolume
        }
    ],
    "Bollinger Band Strategies": [
        {
            name: "Bollinger Bands Strategy", //
            script: bollinger
        },
        {
            name: "Bollinger Bands with Moving Average Confirmation", //
            script: bollingerSma
        },
    ],
    "More Useful Indicators": [
        {
            name: "Average True Range (ATR) Strategy", 
            script: atr
        },
        {
            name: "ADX Indicator Strategy", 
            script: adx
        },
        {
            name: "Donchian Channel Strategy", //
            script: donchianChannel
        },
        {
            name: "Ichimoku Cloud Strategy",
            script: ichimoku
        },
        {
            name: "On-Balance Volume Strategy", //
            script: obv
        },
        {
            name: "Parabolic SAR Strategy",
            script: sar
        },
        {
            name: "Stochastic Oscillator Strategy", //
            script: stochastic
        },
    ],
    "Regression": [
        {
            name: "Simple Linear Regression",
            script: linReg
        },
        {
            name: "Exponential Regression",
            script: expReg
        },
        {
            name: "Polynomial Regression",
            script: polyReg
        },
        {
            name: "Ridge Regression",
            script: ridgeReg
        },
        {
            name: "Lasso Regression",
            script: lassoReg
        },
    ],
    "Machine Learning": [
        {
            name: "Logistic Regression",
            script: logReg
        },
        {
            name: "Support Vector Machines",
            script: svmClassifier
        },
        {
            name: "Random Forest Classifier",
            script: rfClassifier
        },
    ]
};

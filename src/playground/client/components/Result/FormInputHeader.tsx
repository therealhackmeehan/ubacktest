import { FormInputProps } from "../../../../shared/sharedTypes";

function FormInputHeader({ formInputs }: { formInputs: FormInputProps }) {

    return (
        <div className="flex justify-between bg-slate-100 p-1 mt-1 rounded-lg text-xs shadow-sm">
            <div className="p-2">
                <div className="font-extralight flex justify-between items-center">
                    started <span className="font-bold tracking-tight text-slate-700 px-2">{formInputs.startDate}</span>
                </div>
                <div className="font-extralight flex justify-between items-center">
                    ended <span className="font-bold tracking-tight text-slate-700 px-2">{formInputs.endDate}</span>
                </div>
            </div>
            <div className="p-2">
                <div className="font-extralight flex justify-between items-center">
                    trading frequency <span className="font-bold tracking-tight text-slate-700 px-2">{formInputs.intval}</span>
                </div>
            </div>
            <div className="p-2 text-sky-800">
                <div className="font-extralight flex justify-between items-center">
                    trading cost @ <span className="font-bold tracking-tight text-sky-700 px-2">{formInputs.costPerTrade}%</span>
                </div>
            </div>
            <div className="p-2 text-sky-800">
                <div className="font-extralight flex justify-between items-center">
                    Using a burn-in period? <span className="font-bold tracking-tight text-sky-700 px-2">{formInputs.useWarmupDate ? "Y" : "N"}</span>
                </div>
                <div className="font-extralight flex justify-between items-center">
                    burn-in start @ <span className="font-bold tracking-tight text-sky-700 px-2">{formInputs.useWarmupDate ? formInputs.warmupDate : "N/A"}</span>
                </div>
            </div>
        </div>
    )
}

export default FormInputHeader;
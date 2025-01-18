import { FormInputProps } from "../../../../shared/sharedTypes";

function FormInputHeader({ formInputs }: { formInputs: FormInputProps }) {

    return (
        <div className="flex justify-between bg-slate-100 p-2 rounded-b-lg border-slate-300 border-x-2 border-b-2">
            <div className="p-2">
                <div className="font-extralight text-sm flex justify-between items-center">
                    started <span className="text-lg font-bold tracking-tight text-slate-700 px-2">{formInputs.startDate}</span>
                </div>
                <div className="font-extralight text-sm flex justify-between items-center">
                    ended <span className="text-lg font-bold tracking-tight text-slate-700 px-2">{formInputs.endDate}</span>
                </div>
            </div>
            <div className="p-2">
                <div className="font-extralight text-sm flex justify-between items-center">
                    trading frequency <span className="text-lg font-bold tracking-tight text-slate-700 px-2">{formInputs.intval}</span>
                </div>
            </div>
            <div className="p-2 text-sky-800">
                <div className="font-extralight text-sm flex justify-between items-center">
                    trading cost @ <span className="text-lg font-bold tracking-tight text-sky-700 px-2">{formInputs.costPerTrade}%</span>
                </div>
                <div className="font-extralight text-sm flex justify-between items-center">
                    trades executed @ <span className="text-lg font-bold tracking-tight text-sky-700 px-2">{formInputs.timeOfDay}</span>
                </div>
            </div>
        </div>
    )
}

export default FormInputHeader;
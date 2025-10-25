import { useInView } from "react-intersection-observer";

// png image imports
import result_stock1 from "../../client/static/result_stock1.png";
import dark_editorOnly from "../../client/static/dark_editorOnly.png";
import dark_engine from "../../client/static/dark_engine.png";
import light_editorOnly from "../../client/static/light_editorOnly.png";
import light_engine from "../../client/static/light_engine.png";
import light_SP from "../../client/static/light_SP.png";

export default function Gallery() {
  const [ref3, inView3] = useInView({ triggerOnce: true });

  return (
    <div className="mx-2 lg:mx-auto mb-[33vh]">
      <div className="mt-34 w-full grid grid-cols-5 gap-3 md:-space-y-36">
        {/* image 1 */}
        <div
          ref={ref3}
          className={`col-span-4 hover:scale-90 duration-1000 z-50 transform ${inView3 ? "translate-x-0" : "translate-x-60"}`}
        >
          <img
            src={dark_editorOnly}
            alt="editor"
            className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/30"
          />
          <img
            src={light_editorOnly}
            alt="editor"
            className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/30"
          />
        </div>

        {/* image 2 */}
        <div className="col-span-4 col-start-2 hover:scale-90 duration-700 z-50">
          <img
            src={result_stock1}
            alt="basic backtest result"
            className="rounded-md shadow-2xl ring-1 ring-gray-900/30"
          />
        </div>

        {/* image 3 */}
        <div className="col-span-4 col-start-1 hover:scale-90 duration-700 z-50">
          <img
            src={light_engine}
            alt="backtest engine"
            className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/30 max-h-30 md:max-h-100"
          />
          <img
            src={dark_engine}
            alt="backtest engine"
            className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/30 max-h-100"
          />
        </div>

        {/* image 4 */}
        <div className="col-start-2 col-span-4 hover:scale-90 duration-700 z-50">
          <img
            src={light_SP}
            alt="compare to sp500"
            className="rounded-md shadow-2xl ring-1 ring-gray-900/30"
          />
        </div>
      </div>
    </div>
  );
}

import { useInView } from "react-intersection-observer";

// png image imports
import result_stock1 from "../../client/static/result_stock1.png";
import dark_editorOnly from "../../client/static/dark_editorOnly.png";
import dark_engine from "../../client/static/dark_engine.png";
import light_editorOnly from "../../client/static/light_editorOnly.png";
import light_engine from "../../client/static/light_engine.png";
import light_SP from "../../client/static/light_SP.png";
import light_cashEquity from "../../client/static/light_cashEquity.png";
import light_example from "../../client/static/light_example.png";
import dark_example from "../../client/static/dark_example.png";

const baseImgClass = "rounded-md shadow-2xl ring-1 ring-gray-900/30";

function ImageSwitcher({
  light,
  dark,
  alt,
  className = "",
}: {
  light: string;
  dark: string;
  alt: string;
  className?: string;
}) {
  return (
    <>
      <img
        src={dark}
        alt={alt}
        className={`hidden dark:flex ${baseImgClass} ${className}`}
      />
      <img
        src={light}
        alt={alt}
        className={`dark:hidden ${baseImgClass} ${className}`}
      />
    </>
  );
}

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div className="mx-2 lg:mx-auto mb-[33vh]">
      <div className="mt-34 w-full grid md:grid-cols-5 gap-2 md:gap-3 md:-space-y-36">
        {/* image 1 */}
        <div
          ref={ref}
          className={`md:col-span-4 pl-6 md:pl-0 hover:scale-90 duration-1000 z-50 transform ${
            inView ? "translate-x-0" : "translate-x-60"
          }`}
        >
          <ImageSwitcher
            light={light_editorOnly}
            dark={dark_editorOnly}
            alt="editor"
          />
        </div>

        {/* image 2 */}
        <div className="md:col-span-4 md:col-start-2 pr-6 hover:scale-90 duration-700 z-50">
          <img
            src={result_stock1}
            alt="basic backtest result"
            className={baseImgClass}
          />
        </div>

        {/* image 3 */}
        <div className="hidden md:flex md:col-span-4 md:col-start-1 hover:scale-90 duration-700 z-50">
          <ImageSwitcher
            light={light_engine}
            dark={dark_engine}
            alt="backtest engine"
            className="max-h-60 md:max-h-100"
          />
        </div>

        {/* image 4 */}
        <div className="md:col-start-2 pl-6 md:pr-12 md:col-span-4 hover:scale-90 duration-700 z-50">
          <img src={light_SP} alt="compare to sp500" className={baseImgClass} />
        </div>

        {/* image 5 */}
        <div className="md:hidden pr-6 hover:scale-90 duration-700 z-50">
          <ImageSwitcher
            light={light_example}
            dark={dark_example}
            alt="strategy home"
            className="max-h-75"
          />
        </div>

        {/* image 6 */}
        <div className="md:hidden pl-6 hover:scale-90 duration-700 z-50">
          <img
            src={light_cashEquity}
            alt="cash vs. equity chart"
            className={baseImgClass}
          />
        </div>
      </div>
    </div>
  );
}

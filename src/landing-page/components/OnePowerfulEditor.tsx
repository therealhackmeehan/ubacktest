import light_maximizedEditor from '../../client/static/light_maximizedEditor.png';
import dark_maximizedEditor from '../../client/static/dark_maximizedEditor.png';

export default function OnePowerfulEditor() {
  return (
    <div id='features' className='mx-auto mt-36 lg:mt-54 max-w-7xl px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
          One <span className='text-sky-700 dark:text-blue-300'>Powerful</span> Editor.
        </p>
      </div>
      <div className='mx-auto mt-16 w-full sm:mt-20 lg:mt-24'>
        <div className="dark:hidden hover:scale-90 duration-700 z-50">
          <img
            src={light_maximizedEditor}
            alt="editor"
            className="rounded-md shadow-2xl ring-1 ring-gray-900/30"
          />
        </div>
        <div className="hidden dark:flex hover:scale-90 duration-700 z-50">
          <img
            src={dark_maximizedEditor}
            alt="editor"
            className="rounded-md shadow-2xl dark:shadow-white/5 ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
}
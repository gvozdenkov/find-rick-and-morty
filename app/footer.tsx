import { Link } from '@remix-run/react';

export const Footer = () => {
  return (
    <footer className="pt-10 pb-10">
      <div className="container | flex flex-col items-center justify-center gap-4 | sm:flex-row sm:gap-8 sm:justify-between">
        <p>
          &copy;&nbsp;
          <Link to="https://github.com/gvozdenkov" target="_blank" rel="noreferrer">
            Arty Gvozdenkov 2024
          </Link>
        </p>
        <p className="text-sm text-slate-500">
          Powerd by&nbsp;
          <Link
            to="https://rickandmortyapi.com/"
            target="_blank"
            rel="noreferrer"
            className="text-orange-400"
          >
            rickmortyapi
          </Link>
        </p>
      </div>
    </footer>
  );
};

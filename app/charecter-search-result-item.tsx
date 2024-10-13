import { Link } from '@remix-run/react';

import { Character } from 'rickmortyapi';

export const CharecterSearchResultItem = ({ charecter }: { charecter: Character }) => {
  return (
    <li className="border rounded hover:bg-white hover:bg-opacity-10">
      <Link
        to={`/charecters/${charecter.id}`}
        className="flex gap-2 items-center p-2"
        title={charecter.name}
      >
        <div className="flex flex-col | sm:flex-row sm:gap-2 sm:items-center">
          <span>{charecter.name}</span>
          <span className="text-xs text-slate-500">
            {charecter.species} / {charecter.gender}
          </span>
        </div>
        <span className={`status status_${charecter.status.toLocaleLowerCase()} | ml-auto`}>
          {charecter.status}
        </span>
      </Link>
    </li>
  );
};

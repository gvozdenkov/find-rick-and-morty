import { useSearchParams } from '@remix-run/react';
import { Character, Info } from 'rickmortyapi';
import { CharecterSearchResultItem } from './charecter-search-result-item';

export const SearchResults = ({ searchResults }: { searchResults: Info<Character[]> }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const { results, info } = searchResults;

  const nextPage = info?.next ? new URL(info?.next ?? '').searchParams.get('page') : undefined;
  const prevPage = info?.prev ? new URL(info?.prev ?? '').searchParams.get('page') : undefined;

  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl">
        Found&nbsp;<span className="text-slate-500">{info?.count} charecters</span>
      </h2>
      <ul className="flex flex-col gap-2 w-full">
        {results!.map((charecter) => (
          <CharecterSearchResultItem charecter={charecter} key={charecter.id} />
        ))}
      </ul>
      <div className="flex gap-4 place-self-center">
        <button
          className="button"
          onClick={() => {
            setSearchParams((prev) => {
              prev.set('page', prevPage + '');
              return prev;
            });
          }}
          disabled={!prevPage}
        >
          prev
        </button>
        <button
          className="button"
          onClick={() => {
            setSearchParams((prev) => {
              prev.set('page', nextPage + '');
              return prev;
            });
          }}
          disabled={!nextPage}
        >
          next
        </button>
      </div>
    </section>
  );
};

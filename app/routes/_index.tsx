import {
  ClientActionFunction,
  ClientActionFunctionArgs,
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  Form,
  Link,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { Character, getCharacters, Info } from 'rickmortyapi';

export const meta: MetaFunction = () => {
  return [
    { title: 'Rick and Morty Search' },
    { name: 'description', content: 'Find any character from the Rick and Morty universe' },
    { name: 'author', content: 'arty gvozdenkov' },
  ];
};

export const clientAction: ClientActionFunction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const q = Object.fromEntries(formData);
  const cheracter = await getCharacters({
    page: q.page ?? 1,
    name: q.name as string,
    status: q.status as string,
    species: q.species as string,
  });

  return { cheracter };
};

export const clientLoader: ClientLoaderFunction = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const { data } = await getCharacters({
    page: search.get('page') ?? 1,
    name: search.get('name')!,
    status: search.get('status')!,
    species: search.get('species')!,
  });

  return data;
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { info, results } = useLoaderData<Info<Character[]>>();
  console.log('results:', results, 'info:', info);

  const nameDefault = searchParams.get('name');
  const statusDefault = searchParams.get('status');
  const speciesDefault = searchParams.get('species');
  const episodeDefault = searchParams.get('episode');

  const nextPage = info?.next ? new URL(info?.next ?? '').searchParams.get('page') : undefined;
  const prevPage = info?.prev ? new URL(info?.prev ?? '').searchParams.get('page') : undefined;
  console.log('next --->', nextPage);
  console.log('prev --->', prevPage);
  // const prevPage = info ? new URL(info?.prev) : undefined;

  return (
    <div className="flex gap-12 flex-col items-center justify-center">
      <Form className="flex flex-col gap-6 w-full" aria-label="Find charecter">
        <div className="grid grid-cols-1 gap-3 items-center | sm:grid-cols-6 md:gap-y-2">
          <div className="flex flex-col gap-1 w-full | sm:col-span-full">
            <label htmlFor="name">Charecter name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="p-2 bg-transparent border rounded-lg dark:border-white"
              autoComplete="off"
              defaultValue={nameDefault ?? undefined}
            />
          </div>
          <div className="flex flex-col gap-1 w-full | sm:col-span-3 md:col-span-2">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="p-2 bg-transparent border rounded-lg dark:border-white"
              defaultValue={statusDefault ?? undefined}
            >
              <option value=""></option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">unknown</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full | sm:col-span-3 md:col-span-2">
            <label htmlFor="species">Species</label>
            <select
              id="species"
              name="species"
              className="p-2 bg-transparent border rounded-lg dark:border-white"
              defaultValue={speciesDefault ?? undefined}
            >
              <option value="" className="bg-black"></option>
              <option value="human">Human</option>
              <option value="animal">Animal</option>
              <option value="humanoid">Humanoid</option>
              <option value="alien">Alien</option>
              <option value="robot">Robot</option>
              <option value="cronenberg">Cronenberg</option>
              <option value="disease">Disease</option>
              <option value="poopybutthole">Poopybutthole</option>
              <option value="mythological creature">Mythological Creature</option>
              <option value="unknown">unknown</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full | sm:col-span-full md:col-span-2">
            <label htmlFor="episode">Episode</label>
            <input
              id="episode"
              name="episode"
              type="number"
              min="1"
              max="51"
              className="p-2 bg-transparent border rounded-lg dark:border-white"
              autoComplete="off"
              defaultValue={episodeDefault ?? undefined}
            />
          </div>
        </div>
        <button className="button | sm:self-center" type="submit">
          Find
        </button>
      </Form>

      {results && (
        <section className="flex flex-col gap-6 w-full">
          <h2 className="text-2xl">
            Found&nbsp;<span className="text-slate-500">{info?.count} charecters</span>
          </h2>
          <ul className="flex flex-col gap-2 w-full">
            {results.map((charecter) => (
              <li key={charecter.id} className="border rounded hover:bg-white hover:bg-opacity-10">
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
                  <span
                    className={`status status_${charecter.status.toLocaleLowerCase()} | ml-auto`}
                  >
                    {charecter.status}
                  </span>
                </Link>
              </li>
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
      )}
    </div>
  );
}

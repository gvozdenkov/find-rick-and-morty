import {
  ClientActionFunction,
  ClientActionFunctionArgs,
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  Form,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { Character, getCharacters, Info } from 'rickmortyapi';
import { SearchResults } from '~/search-results';

export const meta: MetaFunction = () => {
  return [
    { title: 'Find Rick and Morty' },
    { name: 'description', content: 'Find any character from the Rick and Morty universe' },
    { name: 'author', content: 'arty gvozdenkov' },
  ];
};

export const clientAction: ClientActionFunction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const q = Object.fromEntries(formData);
  const cheracter = await getCharacters({
    page: +(q.page ?? 1),
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
    page: +(search.get('page') ?? 1),
    name: search.get('name')!,
    status: search.get('status')!,
    species: search.get('species')!,
  });

  return data;
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const { info, results } = useLoaderData<Info<Character[]>>();
  console.log('results:', results, 'info:', info);

  const nameDefault = searchParams.get('name');
  const statusDefault = searchParams.get('status');
  const speciesDefault = searchParams.get('species');
  const episodeDefault = searchParams.get('episode');

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

      {results && <SearchResults searchResults={{ info, results }} />}
    </div>
  );
}

import { serializeNonPOJOs } from '$lib/helpers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { ListResult, Record } from 'pocketbase';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals}) {
  const products = await locals.pb.collection("shop_products").getList(0, 500, {sort: '-pinned'});
  if(!products.items.length) throw error(404);
  return {
      products: serializeNonPOJOs(products) as ListResult<Record>
  };
};
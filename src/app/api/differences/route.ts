import { MAX_SERIES_DIFFERENCES_SIZE } from '@/helpers/Constants';
import differences from '@/helpers/differences';
import series from '@/helpers/series';

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);
    const length = parseInt(searchParams.get('length') || "");
    const name = searchParams.get('name') || "";

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    } 

    if (length > MAX_SERIES_DIFFERENCES_SIZE)
      throw new Error("Max length allowed " + (MAX_SERIES_DIFFERENCES_SIZE))

    const array = series(2 * length - 1, name)
    const diff = differences(array)
    return Response.json(diff)
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}
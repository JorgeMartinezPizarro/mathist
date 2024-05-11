import { MAX_SERIES_DIFFERENCES_SIZE } from '@/Constants';
import differences from '@/helpers/differences';
import errorMessage from '@/helpers/errorMessage';
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

    // TODO: Generate full row of series difference
    const array = series(2 * length - 1, name)
    const diff = differences(array)
    const result = diff.slice(0, length).map(subDiff => subDiff.slice(0, length))
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
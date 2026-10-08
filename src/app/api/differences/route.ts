import { MAX_SERIES_DIFFERENCES_SIZE } from '@/Constants';
import differences from '@/helpers/differences';
import { badRequest, errorResponse } from '@/helpers/http';
import { isAdmin } from '@/helpers/auth';
import series from '@/helpers/series';

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);
    const length = parseInt(searchParams.get('length') || "");
    const deep = parseInt(searchParams.get('deep') || "") || length;
    const name = searchParams.get('name') || "";

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    };

    if (!isAdmin(request) && length > MAX_SERIES_DIFFERENCES_SIZE )
      throw badRequest("Max length allowed " + (MAX_SERIES_DIFFERENCES_SIZE))

    // TODO: Generate full row of series difference
    const array = series(2 * length - 1, name)
    const diff = differences(array, deep)
    const result = diff.slice(0, length).map(subDiff => subDiff.slice(0, length))
    return Response.json(result)
  } catch (error) {
    return errorResponse(error);
  }
}
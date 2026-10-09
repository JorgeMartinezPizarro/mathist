import { MAX_SERIES_DIFFERENCES_SIZE } from '@/constants';
import differences from '@/math/differences';
import { badRequest, errorResponse, jsonResponse } from '@/server/http';
import { isAdmin } from '@/server/auth';
import series from '@/math/series';

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);
    const length = parseInt(searchParams.get('length') || "");
    const deep = parseInt(searchParams.get('deep') || "") || length;
    const name = searchParams.get('name') || "";

    if (!isAdmin(request) && length > MAX_SERIES_DIFFERENCES_SIZE )
      throw badRequest("Max length allowed " + (MAX_SERIES_DIFFERENCES_SIZE))

    // TODO: Generate full row of series difference
    const array = series(2 * length - 1, name)
    const diff = differences(array, deep)
    const result = diff.slice(0, length).map(subDiff => subDiff.slice(0, length))
    return jsonResponse(result)
  } catch (error) {
    return errorResponse(error);
  }
}
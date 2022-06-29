/**
 * Calls an API endpoint and returns the response.
 * @param endpoint The endpoint to call.
 * @param options The options to pass to the request.
 * @returns Data requested.
 */
export default async function APICall<T>(endpoint: string, options: RequestInit & { jsonBody?: Record<string, unknown> | unknown[] } = {}): Promise<Jsonify<T>> {
	const response = await fetch(`/api/${endpoint}`, {
		...options,
		headers: {
			"Content-Type": `application/json`,
			"Cache-Control": `no-cache`,
			...(options.headers || {}),
		},
		body: options.body ?? options.jsonBody ? JSON.stringify(options.jsonBody) : undefined,
	});

	if (!response.ok) throw new Error(`Failed to call /${endpoint}: ${response.status} ${response.statusText}`);

	const data = (await response.json()) as unknown;

	if (typeof data === `string`) throw new Error(data);

	if (typeof data !== `object` || data === null) throw new Error(`Invalid response: ${JSON.stringify(data)}`);

	if (`error` in data) throw new Error((data as { error: string }).error);

	return (data as Jsonify<{ data: T }>).data;
}

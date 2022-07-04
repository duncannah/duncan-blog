import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
	headers: {
		"Content-Type": `application/json`,
		"Accept": `application/json`,
		"Cache-Control": `no-cache`,
	},
	responseType: `json`,
});

export class APICall {
	private static async call<T>(endpoint: string, config?: AxiosRequestConfig): Promise<Jsonify<T>> {
		const { data } = await axiosInstance.request<Jsonify<{ data?: T; error?: string }>>({
			...(config?.data instanceof FormData ? {} : { "Content-Type": `application/json` }),
			...(config || {}),
			url: `/api/${endpoint}`,
		});

		if (typeof data !== `object` || data === null) throw new Error(`Invalid response: ${JSON.stringify(data)}`);

		if (data.error) throw new Error(data.error);

		return data.data as Jsonify<T>;
	}

	public static async get<T>(endpoint: string, config?: AxiosRequestConfig): ReturnType<typeof APICall.call<T>> {
		return APICall.call<T>(endpoint, {
			...(config || {}),
			method: `get`,
		});
	}

	public static async post<T>(endpoint: string, config?: AxiosRequestConfig): ReturnType<typeof APICall.call<T>> {
		return APICall.call<T>(endpoint, {
			...(config || {}),
			method: `post`,
		});
	}

	public static async put<T>(endpoint: string, config?: AxiosRequestConfig): ReturnType<typeof APICall.call<T>> {
		return APICall.call<T>(endpoint, {
			...(config || {}),
			method: `put`,
		});
	}

	public static async delete<T>(endpoint: string, config?: AxiosRequestConfig): ReturnType<typeof APICall.call<T>> {
		return APICall.call<T>(endpoint, {
			...(config || {}),
			method: `delete`,
		});
	}

	public static async patch<T>(endpoint: string, config?: AxiosRequestConfig): ReturnType<typeof APICall.call<T>> {
		return APICall.call<T>(endpoint, {
			...(config || {}),
			method: `patch`,
		});
	}
}

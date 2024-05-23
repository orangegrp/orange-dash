type MiddlewareSequence = { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> };

export { MiddlewareSequence };
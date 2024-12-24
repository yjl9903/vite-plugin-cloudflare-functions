export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface PagesResponseBody {}

export type MiddlewareOf<Route extends string, Method extends HttpMethod> = Exclude<
  PagesResponseBody[MatchedRoutes<Route>] extends never
    ? never
    : PagesResponseBody[MatchedRoutes<Route>] extends { ALL: infer R }
      ? R
      : PagesResponseBody[MatchedRoutes<Route>][Method],
  Error | void
>;

export type TypedResponse<Route, Method extends HttpMethod, Default = unknown> = Default extends
  | string
  | boolean
  | number
  | null
  | void
  | object
  ? Default
  : Route extends string
    ? MiddlewareOf<Route, Method> extends never
      ? any
      : MiddlewareOf<Route, Method>
    : any;

// Copy from nitropack
type MatchResult<Key extends string, Exact extends boolean = false, Score extends any[] = []> = {
  [k in Key]: { key: k; exact: Exact; score: Score };
}[Key];

type Subtract<Minuend extends any[] = [], Subtrahend extends any[] = []> = Minuend extends [
  ...Subtrahend,
  ...infer Remainder
]
  ? Remainder
  : never;

type TupleIfDiff<
  First extends string,
  Second extends string,
  Tuple extends any[] = []
> = First extends `${Second}${infer Diff}` ? (Diff extends '' ? [] : Tuple) : [];

type MaxTuple<N extends any[] = [], T extends any[] = []> = {
  current: T;
  result: MaxTuple<N, ['', ...T]>;
}[[N['length']] extends [Partial<T>['length']] ? 'current' : 'result'];

type CalcMatchScore<
  Key extends string,
  Route extends string,
  Score extends any[] = [],
  Init extends boolean = false,
  FirstKeySegMatcher extends string = Init extends true ? ':Invalid:' : ''
> = `${Key}/` extends `${infer KeySeg}/${infer KeyRest}`
  ? KeySeg extends FirstKeySegMatcher // return score if `KeySeg` is empty string (except first pass)
    ? Subtract<[...Score, ...TupleIfDiff<Route, Key, ['', '']>], TupleIfDiff<Key, Route, ['', '']>>
    : `${Route}/` extends `${infer RouteSeg}/${infer RouteRest}`
      ? RouteSeg extends KeySeg
        ? CalcMatchScore<KeyRest, RouteRest, [...Score, '', '']> // exact match
        : KeySeg extends `:${string}`
          ? RouteSeg extends ''
            ? never
            : CalcMatchScore<KeyRest, RouteRest, [...Score, '']> // param match
          : KeySeg extends RouteSeg
            ? CalcMatchScore<KeyRest, RouteRest, [...Score, '']> // match by ${string}
            : never
      : never
  : never;

type _MatchedRoutes<
  Route extends string,
  MatchedResultUnion extends MatchResult<string> = MatchResult<keyof PagesResponseBody>
> = MatchedResultUnion['key'] extends infer MatchedKeys // spread union type
  ? MatchedKeys extends string
    ? Route extends MatchedKeys
      ? MatchResult<MatchedKeys, true> // exact match
      : MatchedKeys extends `${infer Root}/**${string}`
        ? MatchResult<MatchedKeys, false, CalcMatchScore<Root, Route, [], true>> // glob match
        : MatchResult<MatchedKeys, false, CalcMatchScore<MatchedKeys, Route, [], true>> // partial match
    : never
  : never;

export type MatchedRoutes<
  Route extends string,
  MatchedKeysResult extends MatchResult<string> = MatchResult<keyof PagesResponseBody>,
  Matches extends MatchResult<string> = _MatchedRoutes<Route, MatchedKeysResult>
> =
  Extract<Matches, { exact: true }> extends never
    ? Extract<Exclude<Matches, { score: never }>, { score: MaxTuple<Matches['score']> }>['key'] // partial match and glob match
    : Extract<Matches, { exact: true }>['key']; // exact

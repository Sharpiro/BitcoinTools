declare module "angular2-web-worker" {
    class WebWorkerService {
        run<TIn, TOut>(func: (x: TIn) => TOut, data: TIn): Promise<TOut>
    }
}
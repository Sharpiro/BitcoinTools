declare module "angular2-web-worker" {
    class WebWorkerService {
        run<TOne, TTwo>(func: (x: TOne) => TTwo, data: TOne): Promise<TTwo>
    }
}
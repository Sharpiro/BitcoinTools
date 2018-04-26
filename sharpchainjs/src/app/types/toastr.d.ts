declare module "toastr" {
    const toastr: Toastr
    export = toastr

    interface Toastr {
        error(message: string)
        success(message: string)
    }
}
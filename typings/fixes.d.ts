/**
 * ES6 shims taken from /typings/browser/ambient/es6-shim
 */
interface ObjectConstructor {
    assign(target:any, ...sources:any[]): any;
}
interface ArrayConstructor {
    from:any;
}
interface String {
    repeat(count:number): string;
}
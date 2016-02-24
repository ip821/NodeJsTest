module exports{
    export function format(format: string) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    }
    
    export class Class1{
        Name: string
        
        constructor(name: string){
            this.Name = name;
        }
    }
}
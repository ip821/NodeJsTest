export function format(message: string, ...values: any[]) {
    var args = Array.prototype.slice.call(arguments, 1);
    return message.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

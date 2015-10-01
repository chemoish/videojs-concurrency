export default function extend(obj) {
    var arg, i, k;

    for (i = 1; i < arguments.length; i++) {
        arg = arguments[i];

        for (k in arg) {
            if (arg.hasOwnProperty(k) && typeof arg[k] !== 'undefined') {
                obj[k] = arg[k];
            }
        }
    }

    return obj;
}

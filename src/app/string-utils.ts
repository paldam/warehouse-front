export  class  StringUtils {

    static isBlank (input: string) :boolean {
        return !input ? true : input.trim().length === 0 ? true : false;
    }

}
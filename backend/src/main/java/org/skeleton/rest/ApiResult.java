package org.skeleton.rest;

/**
 * Encapsulates a result of REST API request, containing the status code, the error message (if any),
 * and the resulting entity (in case of success).
 *
 * @author Robert Balazsi
 */
public class ApiResult<T> {

    private int code;
    private String error;
    private T result;

    public ApiResult(){
        // no op
    }

    public ApiResult(int code, String error, T result) {
        this.code = code;
        this.error = error;
        this.result = result;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }
}

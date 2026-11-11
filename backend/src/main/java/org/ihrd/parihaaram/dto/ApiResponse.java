package org.ihrd.parihaaram.dto;

import java.time.Instant;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private String code;
    private T data;
    private String timestamp;

    public ApiResponse() {
        this.timestamp = Instant.now().toString();
    }

    public ApiResponse(boolean success, String message, String code, T data) {
        this.success = success;
        this.message = message;
        this.code = code;
        this.data = data;
        this.timestamp = Instant.now().toString();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, "SUCCESS", data);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operation successful", "SUCCESS", data);
    }

    public static <T> ApiResponse<T> error(String message, String code) {
        return new ApiResponse<>(false, message, code, null);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}

package chato;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */
@Provider
public final class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        String origins = requestContext.getHeaderString("Origin");
        if (null != origins) {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", origins);
            responseContext.getHeaders().add("Access-Control-Allow-Credentials", true);
        }
        if (requestContext.getMethod().equals("OPTIONS")) {
            responseContext.getHeaders().add("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, HEAD, OPTIONS");
        }
        String requestHeaders = requestContext.getHeaderString("Access-Control-Request-Headers");
        if (null != requestHeaders) {
            responseContext.getHeaders().add("Access-Control-Allow-Headers", requestHeaders);
        }
    }
}

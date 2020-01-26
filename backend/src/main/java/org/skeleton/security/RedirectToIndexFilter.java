package org.skeleton.security;

import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filter that redirects to the index page, except for the following requests: /oauth, /api, and /static.
 *
 * @author Robert Balazsi
 */
@Component
public class RedirectToIndexFilter implements Filter {

    private static final List<String> WHITE_LIST = Arrays.asList("/oauth", "/api", "/static");

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String requestURI = req.getRequestURI();

        for (String whiteListed : WHITE_LIST) {
            if (requestURI.startsWith(whiteListed) || requestURI.endsWith(".js")) {
                chain.doFilter(request, response);
                return;
            }
        }

        // Forward the request to the index page
        request.getRequestDispatcher("/").forward(request, response);
    }

}

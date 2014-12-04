package chato;

import org.glassfish.jersey.server.ResourceConfig;

public class ChatoApp extends ResourceConfig {

	public ChatoApp() {
		register(CorsFilter.class);
		register(ThreadsResource.class);
	}

}

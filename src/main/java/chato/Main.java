package chato;

import java.net.URI;
import javax.ws.rs.core.UriBuilder;
import org.glassfish.grizzly.http.server.CLStaticHttpHandler;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

public final class Main {

	public static void main(String[] args) throws Exception {
		URI uri = UriBuilder.fromUri("http://0.0.0.0/api").port(80).build();
		ResourceConfig config = new ChatoApp();
		HttpServer server = GrizzlyHttpServerFactory.createHttpServer(uri, config);
		server.getServerConfiguration().addHttpHandler(new CLStaticHttpHandler(ChatoApp.class.getClassLoader()), "/");
		server.start();
    System.out.println("Press enter to stop");
		System.in.read();
		server.shutdown();
	}

}

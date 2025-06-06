error id: file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/AdminController.java
file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/AdminController.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[38,1]

error in qdox parser
file content:
```java
offset: 1256
uri: file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/AdminController.java
text:
```scala
package com.example.deliveryhub.controller;

import java.util.List;
import com.example.deliveryhub.dto.TransporterAdminDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.deliveryhub.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor                    
public class AdminController {

    private final AdminService adminService;
    
    @GetMapping("/transporters/pending")
    public ResponseEntity<List<TransporterAdminDTO>> getPendingTransporters() {
        List<TransporterAdminDTO> pendingTransporters = adminService.getPendingTransporters();
        return ResponseEntity.ok(pendingTransporters);
    }

    @PutMapping("/transporters/{id}/verify")
    public ResponseEntity<?> verifyTransporter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.verifyTransporter(id));
    }

    @GetMapping("/deliveries")

    

}@@

```

```



#### Error stacktrace:

```
com.thoughtworks.qdox.parser.impl.Parser.yyerror(Parser.java:2025)
	com.thoughtworks.qdox.parser.impl.Parser.yyparse(Parser.java:2147)
	com.thoughtworks.qdox.parser.impl.Parser.parse(Parser.java:2006)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:232)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:190)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:94)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:89)
	com.thoughtworks.qdox.library.SortedClassLibraryBuilder.addSource(SortedClassLibraryBuilder.java:162)
	com.thoughtworks.qdox.JavaProjectBuilder.addSource(JavaProjectBuilder.java:174)
	scala.meta.internal.mtags.JavaMtags.indexRoot(JavaMtags.scala:49)
	scala.meta.internal.metals.SemanticdbDefinition$.foreachWithReturnMtags(SemanticdbDefinition.scala:99)
	scala.meta.internal.metals.Indexer.indexSourceFile(Indexer.scala:489)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3(Indexer.scala:587)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3$adapted(Indexer.scala:584)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:619)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:617)
	scala.collection.AbstractIterator.foreach(Iterator.scala:1306)
	scala.meta.internal.metals.Indexer.reindexWorkspaceSources(Indexer.scala:584)
	scala.meta.internal.metals.MetalsLspService.$anonfun$onChange$2(MetalsLspService.scala:902)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.concurrent.Future$.$anonfun$apply$1(Future.scala:687)
	scala.concurrent.impl.Promise$Transformation.run(Promise.scala:467)
	java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1144)
	java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:642)
	java.base/java.lang.Thread.run(Thread.java:1589)
```
#### Short summary: 

QDox parse error in file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/AdminController.java
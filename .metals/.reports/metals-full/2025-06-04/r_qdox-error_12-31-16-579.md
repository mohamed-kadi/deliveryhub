error id: file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/DeliveryController.java
file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/DeliveryController.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[75,1]

error in qdox parser
file content:
```java
offset: 2913
uri: file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/DeliveryController.java
text:
```scala
package com.example.deliveryhub.controller;

import com.example.deliveryhub.dto.DeliveryRequestDTO;
import com.example.deliveryhub.dto.DeliveryResponseDTO;
import com.example.deliveryhub.dto.DeliveryStatusUpdateDTO;
import com.example.deliveryhub.model.Role;
import com.example.deliveryhub.model.User;
import com.example.deliveryhub.service.DeliveryService;
import com.example.deliveryhub.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<DeliveryResponseDTO> createDelivery(@Valid @RequestBody DeliveryRequestDTO dto) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.createRequest(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DeliveryResponseDTO>> getMyRequests() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.CUSTOMER);
        return ResponseEntity.ok(deliveryService.getMyRequests());
    }

    @GetMapping("/available")
    public ResponseEntity<List<DeliveryResponseDTO>> getAvailable() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.getAvailableRequestsForTransporters());
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<DeliveryResponseDTO> acceptRequest(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.acceptRequest(id));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<DeliveryResponseDTO>> getAssignedDeliveries() {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.getAssignedDeliveries());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody DeliveryStatusUpdateDTO statusDTO
    ) {
        User user = securityUtils.getCurrentUser();
        securityUtils.assertRole(user, Role.TRANSPORTER);
        securityUtils.assertVerified(user);
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, statusDTO.getStatus()));
    }

    @GetMapping
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

QDox parse error in file://<WORKSPACE>/src/main/java/com/example/deliveryhub/controller/DeliveryController.java
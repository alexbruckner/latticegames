package com.bru.latticegames.web.rest;

import com.bru.latticegames.web.rest.util.NodeUtil;
import com.codahale.metrics.annotation.Timed;
import com.bru.latticegames.domain.Node;
import com.bru.latticegames.repository.NodeRepository;
import com.bru.latticegames.web.rest.util.HeaderUtil;
import com.bru.latticegames.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing Node.
 */
@RestController
@RequestMapping("/api")
public class NodeResource {

    private final Logger log = LoggerFactory.getLogger(NodeResource.class);

    @Inject
    private NodeRepository nodeRepository;

    /**
     * POST  /nodes -> Create a new node.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Node> createNode(@Valid @RequestBody Node node) throws URISyntaxException {
        log.debug("REST request to save Node : {}", node);
        if (node.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("node", "idexists", "A new node cannot already have an ID")).body(null);
        }
        Node result = nodeRepository.save(node);
        NodeUtil.updateNeighbours(nodeRepository, result, false);
        return ResponseEntity.created(new URI("/api/nodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("node", result.getId().toString()))
            .body(result);
    }

    /**
     * POST  /nodes -> Create a new node.
     */
    @RequestMapping(value = "/nodes/link/{from}/{to}",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Node> linkNodes(@PathVariable("from") Long nodeIdFrom, @PathVariable("to") Long nodeIdTo) throws URISyntaxException {
        log.debug(String.format("REST request to link nodes : %s -> %s", nodeIdFrom, nodeIdTo));

        Node nodeFrom = nodeRepository.findOneWithEagerRelationships(nodeIdFrom);

        Node other = new Node();
        other.setId(nodeIdTo);
        nodeFrom.getNeighbours().add(other);

        return updateNode(nodeFrom);
    }


    /**
     * PUT  /nodes -> Updates an existing node.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Node> updateNode(@Valid @RequestBody Node node) throws URISyntaxException {
        log.debug("REST request to update Node : {}", node);
        if (node.getId() == null) {
            return createNode(node);
        }
        Node result = nodeRepository.save(node);
        NodeUtil.updateNeighbours(nodeRepository, result, false);


        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("node", node.getId().toString()))
            .body(result);
    }

    /**
     * GET  /nodes -> get all the nodes.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Node>> getAllNodes(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Nodes");
        Page<Node> page = nodeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/nodes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /nodes/:id -> get the "id" node.
     */
    @RequestMapping(value = "/nodes/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Node> getNode(@PathVariable Long id) {
        log.debug("REST request to get Node : {}", id);
        Node node = nodeRepository.findOneWithEagerRelationships(id);
        return Optional.ofNullable(node)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /nodes/:id -> delete the "id" node.
     */
    @RequestMapping(value = "/nodes/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteNode(@PathVariable Long id) {
        log.debug("REST request to delete Node : {}", id);
        NodeUtil.updateNeighbours(nodeRepository, nodeRepository.findOneWithEagerRelationships(id), true);
        nodeRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("node", id.toString())).build();
    }
}

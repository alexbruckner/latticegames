package com.bru.latticegames.web.rest;

import com.bru.latticegames.domain.Node;
import com.bru.latticegames.repository.NodeRepository;
import com.codahale.metrics.annotation.Timed;
import com.bru.latticegames.domain.Lattice;
import com.bru.latticegames.repository.LatticeRepository;
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
import java.util.*;

/**
 * REST controller for managing Lattice.
 */
@RestController
@RequestMapping("/api")
public class LatticeResource {

    private final Logger log = LoggerFactory.getLogger(LatticeResource.class);

    @Inject
    private LatticeRepository latticeRepository;

    @Inject
    private NodeRepository nodeRepository;

    /**
     * POST  /lattices -> Create a new lattice.
     */
    @RequestMapping(value = "/lattices",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lattice> createLattice(@Valid @RequestBody Lattice lattice) throws URISyntaxException {
        log.debug("REST request to save Lattice : {}", lattice);
        if (lattice.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("lattice", "idexists", "A new lattice cannot already have an ID")).body(null);
        }

        Lattice result;
        if (lattice.getNodes() != null && lattice.getNodes().size() > 0) {
            result = doDaNodesMofo(lattice);
        } else {
            result = latticeRepository.save(lattice);
        }

        return ResponseEntity.created(new URI("/api/lattices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("lattice", result.getId().toString()))
            .body(result);
    }

    private Lattice doDaNodesMofo(Lattice lattice) {
        Set<Node> latticeNodes = lattice.getNodes();
        lattice.setNodes(null);

        Lattice result = latticeRepository.saveAndFlush(lattice);

        Map<String, Set<String>> links = new HashMap<>();
        latticeNodes.forEach(
            node -> {
                node.setLattice(result);
                links.put(node.getName(), new HashSet<>());
                node.getNeighbours().forEach(neighbour -> links.get(node.getName()).add(neighbour.getName()));
                node.setNeighbours(null);
            }
        );
        List<Node> results = nodeRepository.save(latticeNodes);

        results.forEach(node -> {
            node.setNeighbours(new HashSet<>());
            Set<String> linkToNames = links.get(node.getName());
            results.forEach(node2 -> {
                if (linkToNames.contains(node2.getName())) {
                    node.getNeighbours().add(node2);
                }
            });
        });

        nodeRepository.save(results);
        return result;
    }

    /**
     * PUT  /lattices -> Updates an existing lattice.
     */
    @RequestMapping(value = "/lattices",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lattice> updateLattice(@Valid @RequestBody Lattice lattice) throws URISyntaxException {
        log.debug("REST request to update Lattice : {}", lattice);
        Lattice result;
        if (lattice.getId() == null) {
            return createLattice(lattice);
        } else if (lattice.getNodes() != null || lattice.getNodes().size() > 0) {
            // TODO delete evereeeeethang mofos!
            nodeRepository.delete(nodeRepository.findByLattice_Id(lattice.getId()));
            result = doDaNodesMofo(lattice);
        } else {
            result = latticeRepository.save(lattice);
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("lattice", lattice.getId().toString()))
            .body(result);
    }

    /**
     * GET  /lattices -> get all the lattices.
     */
    @RequestMapping(value = "/lattices",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Lattice>> getAllLattices(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Lattices");
        Page<Lattice> page = latticeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/lattices");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /lattices/:id -> get the "id" lattice.
     */
    @RequestMapping(value = "/lattices/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lattice> getLattice(@PathVariable Long id) {
        log.debug("REST request to get Lattice : {}", id);
        Lattice lattice = latticeRepository.findOne(id);
        Set<Node> nodes = nodeRepository.findByLattice_Id(lattice.getId());
        nodes.forEach(node -> node.setNeighbours(nodeRepository.findOneWithEagerRelationships(node.getId()).getNeighbours()));
        lattice.setNodes(nodes);
        return Optional.ofNullable(lattice)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /lattices/:id -> delete the "id" lattice.
     */
    @RequestMapping(value = "/lattices/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteLattice(@PathVariable Long id) {
        log.debug("REST request to delete Lattice : {}", id);
        nodeRepository.delete(nodeRepository.findByLattice_Id(id));
        latticeRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("lattice", id.toString())).build();
    }
}

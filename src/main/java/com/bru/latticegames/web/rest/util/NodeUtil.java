package com.bru.latticegames.web.rest.util;

import com.bru.latticegames.domain.Node;
import com.bru.latticegames.repository.NodeRepository;

public final class NodeUtil {
    private NodeUtil() {}

    public static void updateNeighbours(NodeRepository nodeRepository, Node node, boolean remove) {
        node.getNeighbours().forEach(neighbour -> {
            neighbour = nodeRepository.findOneWithEagerRelationships(neighbour.getId());
            if(!remove){
                neighbour.getNeighbours().add(node);
            } else {
                neighbour.getNeighbours().remove(node);
            }
            nodeRepository.save(neighbour);
        });
    }
}

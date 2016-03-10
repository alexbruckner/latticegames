package com.bru.latticegames.repository;

import com.bru.latticegames.domain.Node;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

/**
 * Spring Data JPA repository for the Node entity.
 */
public interface NodeRepository extends JpaRepository<Node,Long> {

    @Query("select distinct node from Node node left join fetch node.neighbours")
    List<Node> findAllWithEagerRelationships();

    @Query("select node from Node node left join fetch node.neighbours where node.id =:id")
    Node findOneWithEagerRelationships(@Param("id") Long id);

    Set<Node> findByLattice_Id(Long latticeId);

}
